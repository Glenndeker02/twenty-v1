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
  Image,
} from 'react-native';
import { usePeople } from '../../src/hooks/usePeople';
import { Person } from '../../src/types/records';
import { Ionicons } from '@expo/vector-icons';

export default function PeopleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { people, loading, hasNextPage, loadMore, refetch } = usePeople(
    searchQuery
      ? {
          or: [
            { name: { firstName: { ilike: `%${searchQuery}%` } } },
            { name: { lastName: { ilike: `%${searchQuery}%` } } },
            { email: { ilike: `%${searchQuery}%` } },
          ],
        }
      : undefined
  );

  const getInitials = (person: Person) => {
    const firstName = person.name?.firstName || '';
    const lastName = person.name?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderPersonCard = ({ item }: { item: Person }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(item)}</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.personName}>
            {item.name?.firstName} {item.name?.lastName}
          </Text>
          {item.email && (
            <View style={styles.metaRow}>
              <Ionicons name="mail-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{item.email}</Text>
            </View>
          )}
          {item.phone && (
            <View style={styles.metaRow}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{item.phone}</Text>
            </View>
          )}
          {item.company && (
            <View style={styles.metaRow}>
              <Ionicons name="business-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{item.company.name}</Text>
            </View>
          )}
          {item.city && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{item.city}</Text>
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
          placeholder="Search people..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && people.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5c7cfa" />
        </View>
      ) : people.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="people-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No people found</Text>
        </View>
      ) : (
        <FlatList
          data={people}
          renderItem={renderPersonCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
          onEndReached={() => {
            if (hasNextPage && !loading) {
              loadMore();
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5c7cfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
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
    flex: 1,
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
