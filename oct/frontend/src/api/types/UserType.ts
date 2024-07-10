export type UserType = {
  id: string;
  osu_id: number;
  osu_username: string;
  osu_avatar: string;
  osu_cover: string;
  is_admin: boolean;
};

export type UserExtendedType = {
  roles: {
    host: boolean;
    registered_player: boolean;
    custom_mapper: boolean;
    mappooler: boolean;
    playtester: boolean;
    streamer: boolean;
    commentator: boolean;
    referee: boolean;
  };
} & UserType;
