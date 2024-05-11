export type Session = {
  isAuthenticated: boolean;
  user: null | {
    osu_id: number;
    osu_username: string;
    osu_avatar: string;
    osu_cover: string;
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
  };
};
