import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type { PageConfig } from "~/types/page_config/PageConfig";

export const NotificationRepository = <T>(
    fetch: $Fetch<T, NitroFetchRequest>
) => {
    const getQuantityOfNotification = async (): Promise<number> => {
        try {
            const response: ApiResponse = await fetch(
                `/notification/GetQuantityOfNotification`,
                {
                    method: "GET",
                }
            );

            return response.result;
        } catch (error: any) {
            return 0;
        }
    };

    const getUserNotificationPaging = async (
        payload: PageConfig
    ): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/notification/GetUserNotificationPaging`,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const markAsRead = async (payload: {
        notificationId: string;
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/notification/MarkAsRead`,
                {
                    method: "PUT",
                    params: {
                        notificationId: payload.notificationId,
                    },
                }
            );

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getQuantityOfNotification,
        getUserNotificationPaging,
        markAsRead,
    };
};
