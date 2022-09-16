import type { CertificateCreationOptions, CertificateCreationResult, PrivateKeyCreationOptions, CSRCreationOptions, Callback } from 'pem';
export declare type CreateCertificate = (options: CertificateCreationOptions, callback: Callback<CertificateCreationResult>) => void;
export declare type CreateCsr = (options: CSRCreationOptions, callback: Callback<{
    csr: string;
    clientKey: string;
}>) => void;
export declare type CreatePrivateKey = (keyBitsize: number, options: PrivateKeyCreationOptions, callback: Callback<{
    key: string;
}>) => void;
