import * as React from 'react';

interface VercelInviteUserEmailProps {
  username: string;
  userImage: string;
  inviteByUsername: string;
  inviteByEmail: string;
  teamName: string;
  teamImage: string;
  inviteLink: string;
  inviteFromIp: string;
  inviteFromLocation: string;
}

export default function VercelInviteUserEmail({
  username,
  userImage,
  inviteByUsername,
  inviteByEmail,
  teamName,
  teamImage,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
}: VercelInviteUserEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <img src={teamImage} alt="Team Logo" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        <h1 style={{ color: '#000', fontSize: '24px', marginTop: '20px' }}>
          Join {teamName} on Our Platform
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '24px' }}>
          Hello {username},
        </p>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '24px' }}>
          {inviteByUsername} ({inviteByEmail}) has invited you to join the {teamName} team.
        </p>
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <a
            href={inviteLink}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Join the team
          </a>
        </div>
        <div style={{ color: '#666', fontSize: '14px', marginTop: '40px' }}>
          <p>This invitation was sent from {inviteFromLocation} ({inviteFromIp})</p>
          <p>If you were not expecting this invitation, you can ignore this email.</p>
        </div>
      </div>
    </div>
  );
}