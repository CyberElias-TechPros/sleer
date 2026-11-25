/** Once an insert was attempted its outcome may be ambiguous. Do not remove
 * the object: the server may have committed the record despite a timeout. */
export function shouldRemoveFailedUpload(uploaded: boolean, metadataAttempted: boolean): boolean {
  return uploaded && !metadataAttempted;
}
