import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_OPPORTUNITIES } from '../../src/api/records.graphql';
import { Opportunity, RecordConnection } from '../../src/types/records';
import { Ionicons } from '@expo/vector-icons';

export default function OpportunitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, refetch, fetchMore } = useQuery<{
    opportunities: RecordConnection<Opportunity>;
  }>(GET_OPPORTUNITIES, {
    variables: {
      filter: searchQuery
        ? { name: { ilike: `%${searchQuery}%` } }
        : undefined,
      orderBy: [{ createdAt: 'DescNullsLast' }],
      first: 50,
    },
    notifyOnNetworkStatusChange: true,
  });

  const opportunities = data?.opportunities?.edges?.map((edge) => edge.node) || [];
  const hasNextPage = data?.opportunities?.pageInfo?.hasNextPage || false;

  const formatAmount = (amount: Opportunity['amount']) => {
    if (!amount) return 'N/A';
    const value = amount.amountMicros / 1000000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: amount.currencyCode || 'USD',
    }).format(value);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      NEW: '#5c7cfa',
      MEETING: '#748ffc',
      PROPOSAL: '#845ef7',
      NEGOTIATION: '#cc5de8',
      WON: '#51cf66',
      LOST: '#ff6b6b',
    };
    return colors[stage] || '#999';
  };

  const renderOpportunityCard = ({ item }: { item: Opportunity }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy" size={24} color="#5c7cfa" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.opportunityName}>{item.name}</Text>

          <View style={styles.amountRow}>
            <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
            <View
              style={[
                styles.stageBadge,
                { backgroundColor: getStageColor(item.stage) },
              ]}
            >
              <Text style={styles.stageText}>{item.stage}</Text>
            </View>
          </View>

          {item.company && (
            <View style={styles.metaRow}>
              <Ionicons name="business-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{item.company.name}</Text>
            </View>
          )}

          {item.pointOfContact && (
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={14} color="#666" />
              <Text style={styles.metaText}>
                {item.pointOfContact.name.firstName}{' '}
                {item.pointOfContact.name.lastName}
              </Text>
            </View>
          )}

          {item.closeDate && (
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.metaText}>
                Close: {new Date(item.closeDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search opportunities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && opportunities.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5c7cfa" />
        </View>
      ) : opportunities.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="trophy-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No opportunities found</Text>
        </View>
      ) : (
        <FlatList
          data={opportunities}
          renderItem={renderOpportunityCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
          onEndReached={() => {
            if (hasNextPage && !loading) {
              fetchMore({
                variables: {
                  after: data?.opportunities?.pageInfo?.endCursor,
                },
              });
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color="#5c7cfa" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  opportunityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#51cf66',
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
