import { IErrorBuilder } from "../interface/IErrorBuilder";

/**
 * For building Errors/Warnings
 * 
 * @class ErrorBuilder
 */
class ErrorBuilder {

    /**
    * Returns an error object
    * 
    * @static
    * @returns {error object}
    * 
    * @memberOf ErrorBuilder
    */
    public static buildError(statusCode: number, statusDescription: string, errorCode: number, errorMessage: string): IErrorBuilder {
        let errorObject: IErrorBuilder = {
            statusCode: statusCode,
            statusDescription: statusDescription,
            errorCode: errorCode,
            errorMessage: errorMessage
        };
        return errorObject;
    }

}

export = ErrorBuilder;