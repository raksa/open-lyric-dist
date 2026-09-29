/**
 * What a reader types has to stay one line of a `Config` field.
 *
 * Newlines are the only characters that could turn one field into two — a
 * pasted multi-line value is the realistic way in — so they collapse to
 * spaces; the surrounding whitespace goes because the source line's own
 * separator supplies it.
 */
declare function normalizeConfigTextValue(value: any): string;
/** The line as it should read once `nextValue` is in it, or `null`. */
declare function buildConfigTextFieldLine(sourceLine: any, fieldName: any, nextValue: any): string | null;
/** The field's current value as the document holds it, or `null`. */
declare function readConfigTextFieldValue(sourceLine: any, fieldName: any): string | null;
declare function applyPreviewControllerConfigTextEditingMethods(PreviewControllerClass: any): void;
export { applyPreviewControllerConfigTextEditingMethods, buildConfigTextFieldLine, normalizeConfigTextValue, readConfigTextFieldValue, };
