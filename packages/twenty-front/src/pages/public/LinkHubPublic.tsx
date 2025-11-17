import { useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const LinkHubPublic = () => {
  const { t } = useLingui();
  const { slug } = useParams();
  const [linkHub, setLinkHub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkHub = async () => {
      try {
        const response = await fetch(`/links/${slug}`);
        if (!response.ok) {
          throw new Error('Link hub not found');
        }
        const data = await response.json();
        setLinkHub(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkHub();
  }, [slug]);

  const handleLinkClick = async (itemId: string) => {
    try {
      await fetch(`/links/${slug}/click/${itemId}`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        {t`Loading...`}
      </div>
    );
  }

  if (error || !linkHub) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <h1>{t`Link Hub Not Found`}</h1>
        <p>{error || t`The requested link hub does not exist or is not active.`}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: linkHub.backgroundColor || '#ffffff',
        color: linkHub.textColor || '#000000',
        minHeight: '100vh',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {linkHub.avatarUrl && (
          <img
            src={linkHub.avatarUrl}
            alt={linkHub.title}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}

        <h1 style={{ margin: 0, textAlign: 'center', fontSize: '32px' }}>
          {linkHub.title}
        </h1>

        {linkHub.description && (
          <p style={{ margin: 0, textAlign: 'center', fontSize: '18px', opacity: 0.8 }}>
            {linkHub.description}
          </p>
        )}

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {linkHub.items.map((item: any) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                border: `2px solid ${linkHub.textColor}20`,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              {item.icon && (
                <span style={{ fontSize: '24px' }}>
                  {item.icon}
                </span>
              )}
              <span style={{ fontSize: '18px', fontWeight: '500', flex: 1 }}>
                {item.title}
              </span>
            </a>
          ))}
        </div>

        <footer style={{ marginTop: '40px', opacity: 0.6, fontSize: '14px' }}>
          Powered by Twenty CRM
        </footer>
      </div>
    </div>
  );
};
