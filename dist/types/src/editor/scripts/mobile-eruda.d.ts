declare function shouldBootstrapMobileEruda({ isMobileDevice, }?: {
    isMobileDevice?: boolean | undefined;
}): boolean;
declare function isLikelyMobileBrowser(): boolean;
declare function bootstrapMobileEruda(): any;
export { bootstrapMobileEruda, isLikelyMobileBrowser, shouldBootstrapMobileEruda, };
