import { createTranscriptController } from './transcript-controller.js';
declare const olEditorTranscriptPluginData: {
    id: string;
    style: string[];
    transcript: {
        actionLabel: string;
        create: typeof createTranscriptController;
        displayName: string;
        id: string;
    };
};
export { olEditorTranscriptPluginData };
