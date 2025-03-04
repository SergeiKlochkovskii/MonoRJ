export interface TuxedoServiceInfo {
    ramo: string;
    subRamo: string;
    fileName: string;
    service: string;

}

export interface BufferStorageExtDTO {
    ramo: string;
    subRamo: string;
    fileName: string;
    service: string;
    inputData: string;
    outputData: string;
    callId?: string;
    numberOfSelectedServiceCalls?: number;
    numberOfAllServiceCalls?: number;
    logFilename: string;
    wsSessionId: string
}
