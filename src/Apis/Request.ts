import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";

/**
 * GetPepars
 * @param cb callback function
 */
export const GetRequests = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.get('api/Request/GetRequests', {
                params: body
            });
            cb && cb(data, status);
        } catch (error) {
            console.log('GetRequests error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * UpdateRequest
 * @param cb callback function
 *  @param params {
  "requestId",
  "statusId",
  "rejectReasonId",
  "rejectReason""
}
 */
export const UpdateRequest = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/Request/UpdateRequest',
                body
            );
            cb && cb(data, status);
        } catch (error) {
            console.log('UpdateRequest error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * AddPaperOfferRequest
 * @param cb callback function
 *  @param params {
  "paperOfferId",
  "paperOfferBranchId",
  "quantity",
  "totalPrice""
}
 */
export const AddPaperOfferRequest = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/Offer/AddPaperOfferRequest',
                body
            );
            cb && cb(data, status);
        } catch (error) {
            console.log('AddPaperOfferRequest error = ', error);
            cb && cb(error, 500);
        }
    };
};

export const AddRate = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/User/AddRate',
                body
            );
            cb && cb(data, status);
        } catch (error) {
            console.log('AddRate error = ', error);
            cb && cb(error, 500);
        }
    };
};

