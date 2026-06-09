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
            // console.log('GetRequests error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * GetSellerList
 * @param cb callback function
 */
export const GetSellerList = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/User/GetSellerList',
                body
            );
            cb && cb(data, status);
        } catch (error) {
            // console.log('GetSellerList error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * GetSellerList
 * @param cb callback function
 */
export const GetSellerData = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.get('api/User/GetSellerData', {
                params: body
            });
            cb && cb(data, status);
             // console.log('GetSellerData = ', data);
        } catch (error) {
            // console.log('GetSellerData error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * GetMyRequests
 * @param cb callback function
 */
export const GetMyRequests = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {
// console.log('ppp',body);

            const { data, status } = await globalAPI.get('api/Request/GetMyRequests', {
                params: body
            });
            cb && cb(data, status);
                // console.log('GetMyRequests = ', data);
        } catch (error) {
            // console.log('GetRequests error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * GetMyBranches
 * @param cb callback function
 */
export const GetMyBranches = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.get('api/User/GetMyBranches', {
                params: body
            });
            console.log("GetMyBranches data = ", data);
            
            cb && cb(data, status);
        } catch (error) {
            console.log('GetMyBranches error = ', error);
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
            // console.log('UpdateRequest error = ', error);
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

            const { data, status } = await globalAPI.post(body.type==1?'api/Offer/AddPaperOfferRequest':body.type==2?"api/Offer/AddInkOfferRequest":"api/Offer/AddPrintingPressOfferRequest",
                body
            );
            cb && cb(data, status);
              // console.log('AddPaperOfferRequest  = ', data,status);
        } catch (error) {
            // console.log('AddPaperOfferRequest error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * AddPaperOffer
 * @param cb callback function
 *  @param params {
  "paperId",
  "paperSizeId",
  "width",
  "min",
  "price",
  "description",
  "endDate",
  "branches",
  "includeDelivery",
}
 */
export const AddPaperOffer = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/Offer/AddPaperOffer',
                body
            );
            console.log("botttty",body);
            console.log('AddPaperOffer data = ', data);
            
            cb && cb(data, status);
        } catch (error) {
            console.log('AddPaperOffer error = ', error);
            cb && cb(error, 500);
        }
    };
};
/**
 * UpdatePaperOffer
 * @param cb callback function
 *  @param params {
  "paperId",
  "paperSizeId",
  "width",
  "min",
  "price",
  "description",
  "endDate",
  "branches",
  "includeDelivery",
}
 */
export const UpdatePaperOffer = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {
  console.log("FORMDATA INSTANCE:", body instanceof FormData);
  console.log("FORMDATA:", body);
            const { data, status } = await globalAPI.put('api/Offer/UpdatePaperOffer',
                body, {
  headers: {
    "Content-Type": "multipart/form-data",
  }}
            );
            console.log('UpdatePaperOffer data = ', data);
            
            cb && cb(data, status);
        } catch (error) {
            console.log('UpdatePaperOffer error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * AddPrintingPressOffer
 * @param cb callback function
 *  @param params {
  "paperId",
  "paperSizeId",
  "width",
  "min",
  "price",
  "description",
  "endDate",
  "branches",
  "includeDelivery",
}
 */
export const AddPrintingPressOffer = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/Offer/AddPrintingPressOffer',
                body
              , {
  headers: {
    "Content-Type": "multipart/form-data",
  }});
AddPrintingPressOffer
            // console.log('AddPrintingPressOffer response = ', data);
            cb && cb(data, status);
        } catch (error) {
            // console.log('AddPrintingPressOffer error = ', error);
            cb && cb(error, 500);
        }
    };
};

/**
 * UpdatePrintingOffer
 * @param cb callback function
 *  @param params {
  "paperId",
  "paperSizeId",
  "width",
  "min",
  "price",
  "description",
  "endDate",
  "branches",
  "includeDelivery",
}
 */
export const UpdatePrintingOffer = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {
              // console.log("botttty",body);

            const { data, status } = await globalAPI.put('api/Offer/UpdatePrintingOffer',
                body
           , {
  headers: {
    "Content-Type": "multipart/form-data",
  }});
            // console.log('UpdatePrintingOffer response = ', data);
            cb && cb(data, status);
        } catch (error) {
            // console.log('UpdatePrintingOffer error = ', error);
            cb && cb(error, 500);
        }
    };
};
/**
 * AddPaperOffer
 * @param cb callback function
 *  @param params {
  "paperId",
  "paperSizeId",
  "width",
  "min",
  "price",
  "description",
  "endDate",
  "branches",
  "includeDelivery",
}
 */
export const AddInkOffer = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {

            const { data, status } = await globalAPI.post('api/Offer/AddInkOffer',
                body
           , {
  headers: {
    "Content-Type": "multipart/form-data",
  }});
              // console.log("botttty",body);
            // console.log('AddInkOffer response = ', data);
            cb && cb(data, status);
        } catch (error) {
            // console.log('AddInkOffer error = ', error);
            cb && cb(error, 500);
        }
    };
};
/**
 * UpdateInkOffer
 * @param cb callback function
 *  @param params {
  "paperId",
  "paperSizeId",
  "width",
  "min",
  "price",
  "description",
  "endDate",
  "branches",
  "includeDelivery",
}
 */
export const UpdateInkOffer = (body: any, cb?: (data: any, status: any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
        try {
              // console.log("botttty",body);

            const { data, status } = await globalAPI.put('api/Offer/UpdateInkOffer',
                body
           , {
  headers: {
    "Content-Type": "multipart/form-data",
  }});

            // console.log('UpdateInkOffer response = ', data);
            cb && cb(data, status);
        } catch (error) {
            // console.log('UpdateInkOffer error = ', error);
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
            // console.log('AddRate error = ', error);
            cb && cb(error, 500);
        }
    };
};

