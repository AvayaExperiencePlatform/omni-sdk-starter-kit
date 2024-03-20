import { readFileSync } from 'node:fs';

/**
 * Read the SSL certificate and its private key from file system.
 * @param {string} certificatePath Path to SSL certificate.
 * @param {string} privateKeyPath Path to private key of the SSL certificate.
 * @returns {{certificate: string, privateKey: string}} Object containing the SSL certificate and the private key.
 */
export function loadSslCertificateDetails(certificatePath, privateKeyPath) {
    const sslCertificate = readFileSync(certificatePath, {encoding: "utf-8"});
    const privateKey = readFileSync(privateKeyPath, {encoding: "utf-8"});

    return {
        certificate: sslCertificate,
        privateKey: privateKey
    }
}