import { connect } from 'react-redux';
import DrawingAnnotations from './DrawingAnnotations';
import withProviders from '../common/withProviders';
import { AnnotationDrawing } from '../@types';
import {
    AppState,
    CreatorItemDrawing,
    getActiveAnnotationId,
    getAnnotationMode,
    getAnnotationsForLocation,
    getCreatorStagedForLocation,
    getIsCurrentFileVersion,
    isCreatorStagedDrawing,
    Mode,
    resetCreatorAction,
    setActiveAnnotationIdAction,
    setReferenceIdAction,
    setStagedAction,
    setStatusAction,
} from '../store';
import { isDrawing } from './drawingUtil';

export type Props = {
    activeAnnotationId: string | null;
    annotations: AnnotationDrawing[];
    isCreating: boolean;
    isCurrentFileVersion: boolean;
    staged: CreatorItemDrawing | null;
};

export const mapStateToProps = (state: AppState, { location }: { location: number }): Props => {
    const staged = getCreatorStagedForLocation(state, location);

    return {
        activeAnnotationId: getActiveAnnotationId(state),
        annotations: getAnnotationsForLocation(state, location).filter(isDrawing),
        isCreating: getAnnotationMode(state) === Mode.DRAWING,
        isCurrentFileVersion: getIsCurrentFileVersion(state),
        staged: isCreatorStagedDrawing(staged) ? staged : null,
    };
};

export const mapDispatchToProps = {
    resetCreator: resetCreatorAction,
    setActiveAnnotationId: setActiveAnnotationIdAction,
    setReferenceId: setReferenceIdAction,
    setStaged: setStagedAction,
    setStatus: setStatusAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withProviders(DrawingAnnotations));
