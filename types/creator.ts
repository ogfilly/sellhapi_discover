export interface Creator {
  id:            string;
  username:      string;
  displayName:   string;
  bio:           string | null;
  profilePhoto:  string | null;
  followerCount: number;
  lookCount:     number;
  isVerified:    boolean;
  isFollowing:   boolean;
  createdAt:     string;
}

export interface CreatorSummary
  extends Pick<Creator, "id" | "username" | "displayName" | "profilePhoto" | "isVerified"> {}
