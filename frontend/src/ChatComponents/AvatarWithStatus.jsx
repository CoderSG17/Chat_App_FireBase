import * as React from 'react';
import Badge from '@mui/joy/Badge';
import Avatar from '@mui/joy/Avatar';
import { useAuth } from '../Context/Auth';

export default function AvatarWithStatus({userImg}) {
  const {userData} = useAuth()

  const online = Date.now() - userData?.lastSeen <=10001
  return (
    <div>
      <Badge
        color={online ? 'success' : 'neutral'}
        variant={online ? 'solid' : 'soft'}
        size="sm"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeInset="4px 4px"
      >
        <Avatar size="sm" src={userImg?userImg:"error"}/>
      </Badge>
    </div>
  );
}
