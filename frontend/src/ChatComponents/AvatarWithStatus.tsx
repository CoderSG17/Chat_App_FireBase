import * as React from 'react';
import Badge from '@mui/joy/Badge';
import Avatar, { AvatarProps } from '@mui/joy/Avatar';

export default function AvatarWithStatus({userImg}) {
  return (
    <div>
      <Badge
        // color={online ? 'success' : 'neutral'}
        // variant={online ? 'solid' : 'soft'}
        size="sm"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeInset="4px 4px"
      >
        <Avatar size="sm" src={userImg?userImg:"error"}/>
      </Badge>
    </div>
  );
}
