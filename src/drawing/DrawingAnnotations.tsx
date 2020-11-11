import * as React from 'react';
import DrawingList from './DrawingList';
import DrawingCreator from './DrawingCreator';
import DrawingPath from './DrawingPath';
import { AnnotationDrawing } from '../@types';
import { CreatorItemDrawing, CreatorPath, CreatorPathGroup, CreatorStatus } from '../store';
import './DrawingAnnotations.scss';

type Props = {
    activeAnnotationId: string | null;
    annotations: AnnotationDrawing[];
    isCreating: boolean;
    location: number;
    setActiveAnnotationId: (annotationId: string | null) => void;
    setStaged: (staged: CreatorItemDrawing | null) => void;
    setStatus: (status: CreatorStatus) => void;
    staged?: CreatorItemDrawing | null;
};

const DrawingAnnotations = (props: Props): JSX.Element => {
    const {
        activeAnnotationId,
        annotations,
        isCreating,
        location,
        setActiveAnnotationId,
        setStaged,
        setStatus,
        staged,
    } = props;

    const handleAnnotationActive = (annotationId: string | null): void => {
        setActiveAnnotationId(annotationId);
    };

    const handleStart = (): void => {
        if (staged === null) {
            setStaged(null);
        }
        setStatus(CreatorStatus.started);
    };
    const handleStop = (pathGroup: CreatorPathGroup): void => {
        const { drawnPathGroups = [], stashedPathGroups = [] } = staged || {};
        const payload = {
            drawnPathGroups: drawnPathGroups.concat(pathGroup),
            location,
            stashedPathGroups,
        };

        setStaged(payload);
        setStatus(CreatorStatus.staged);
    };

    return (
        <>
            <DrawingList
                activeId={activeAnnotationId}
                annotations={annotations}
                className="ba-DrawingAnnotations-list"
                onSelect={handleAnnotationActive}
            />

            {staged && (
                <svg className="ba-DrawingAnnotations-target" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <g>
                        {staged.drawnPathGroups.map(({ id: groupId, paths, stroke }) => (
                            <g key={groupId}>
                                {paths.map(path => (
                                    <DrawingPath key={(path as CreatorPath).id} path={path} stroke={stroke} />
                                ))}
                            </g>
                        ))}
                    </g>
                </svg>
            )}

            {isCreating && (
                <DrawingCreator className="ba-DrawingAnnotations-creator" onStart={handleStart} onStop={handleStop} />
            )}
        </>
    );
};

export default DrawingAnnotations;
