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
    isCreatorStagedDrawing,
    Mode,
    setActiveAnnotationIdAction,
    setStagedAction,
    setStatusAction,
} from '../store';
import { isDrawing } from './drawingUtil';

export type Props = {
    activeAnnotationId: string | null;
    annotations: AnnotationDrawing[];
    isCreating: boolean;
    staged: CreatorItemDrawing | null;
};

export const mapStateToProps = (state: AppState, { location }: { location: number }): Props => {
    const staged = getCreatorStagedForLocation(state, location);

    return {
        activeAnnotationId: getActiveAnnotationId(state),
        annotations: getAnnotationsForLocation(state, location).filter(isDrawing),
        isCreating: getAnnotationMode(state) === Mode.DRAWING,
        staged: isCreatorStagedDrawing(staged) ? staged : null,
    };
};

export const mapDispatchToProps = {
    setActiveAnnotationId: setActiveAnnotationIdAction,
    setStaged: setStagedAction,
    setStatus: setStatusAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withProviders(DrawingAnnotations));
