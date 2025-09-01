export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & {success: true};
type ErrorResponse = ActionResponse<undefined> & {success: false};

type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};
