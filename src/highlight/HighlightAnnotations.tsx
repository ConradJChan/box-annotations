import * as React from 'react';
import noop from 'lodash/noop';
import HighlightCanvas from './HighlightCanvas';
import HighlightCreator from './HighlightCreator';
import HighlightList from './HighlightList';
import HighlightSvg from './HighlightSvg';
import HighlightTarget from './HighlightTarget';
import PopupReply from '../components/Popups/PopupReply';
import { AnnotationHighlight } from '../@types';
import { CreateArg } from './actions';
import { CreatorItemHighlight, CreatorStatus, Mode, SelectionItem } from '../store';
import { Shape } from '../region';
import './HighlightAnnotations.scss';
import { getBoundingRect } from './highlightUtil';

type Props = {
    activeAnnotationId: string | null;
    annotations: AnnotationHighlight[];
    createHighlight?: (arg: CreateArg) => void;
    isCreating: boolean;
    location: number;
    message: string;
    resetCreator: () => void;
    selection: SelectionItem | null;
    setActiveAnnotationId: (annotationId: string | null) => void;
    setMessage: (message: string) => void;
    setMode: (mode: Mode) => void;
    setStaged: (staged: CreatorItemHighlight | null) => void;
    setStatus: (status: CreatorStatus) => void;
    staged?: CreatorItemHighlight | null;
    status: CreatorStatus;
};

const filterRects = (rectList: Shape[]): Shape[] => {
    const rects: Shape[] = [];

    // Deduplicate similar rects
    rectList.forEach(curr => {
        const prev = rects.pop();
        // empty list, push current
        if (!prev) {
            rects.push(curr);
            return;
        }

        // different rects, push both
        if (prev.x !== curr.x || prev.width !== curr.width || Math.abs(prev.y - curr.y) > 2) {
            rects.push(prev);
            rects.push(curr);
            return;
        }

        // the same rect, push the larger one
        rects.push(prev.height > curr.height ? prev : curr);
    });

    return rects;
};

const groupByRow = (shapes: Shape[]): Record<number, Shape[]> => {
    const rows: Record<number, Shape[]> = {};
    shapes.forEach(shape => {
        const { y } = shape;
        if (!rows[y]) {
            rows[y] = [shape];
        } else {
            rows[y].push(shape);
        }
    });

    return rows;
};

const combineRows = (allShapes: Shape[]): Shape[] => {
    const t0 = performance.now();
    console.log(allShapes);
    const dedupedRects = filterRects(allShapes);
    console.log(dedupedRects);
    const rowMap = groupByRow(dedupedRects);
    console.log(rowMap);
    const result = Object.values(rowMap).reduce(
        (finalShapes, shapes) => finalShapes.concat(getBoundingRect(shapes)),
        [],
    );
    console.log(result);
    const t1 = performance.now();
    console.log(`took ${t1 - t0}`);

    return result;
};

const HighlightAnnotations = (props: Props): JSX.Element => {
    const {
        activeAnnotationId,
        annotations = [],
        createHighlight = noop,
        isCreating = false,
        message,
        resetCreator,
        selection,
        setActiveAnnotationId,
        setMessage,
        staged,
        status,
    } = props;
    const [highlightRef, setHighlightRef] = React.useState<HTMLAnchorElement | null>(null);

    const canReply = status !== CreatorStatus.started && status !== CreatorStatus.init;
    const isPending = status === CreatorStatus.pending;

    const handleAnnotationActive = (annotationId: string | null): void => {
        setActiveAnnotationId(annotationId);
    };

    const handleCancel = (): void => {
        resetCreator();
    };

    const handleChange = (text = ''): void => {
        setMessage(text);
    };

    const handleSubmit = (): void => {
        if (!staged) {
            return;
        }

        createHighlight({ ...staged, message });
    };

    if (selection) {
        console.log('About to do the thing');
        const result = combineRows(selection.rects);
        console.log(result);
    }

    return (
        <>
            {/* Layer 1: Saved annotations */}
            <HighlightList activeId={activeAnnotationId} annotations={annotations} onSelect={handleAnnotationActive} />

            {/* Layer 2: Drawn (unsaved) incomplete annotation target, if any */}
            {isCreating && <HighlightCreator className="ba-HighlightAnnotations-creator" />}

            {/* Layer 3a: Staged (unsaved) highlight target, if any */}
            {isCreating && staged && (
                <div className="ba-HighlightAnnotations-target">
                    <HighlightCanvas shapes={staged.shapes} />
                    <HighlightSvg>
                        <HighlightTarget ref={setHighlightRef} annotationId="staged" shapes={staged.shapes} />
                    </HighlightSvg>
                </div>
            )}

            {/* Layer 3b: Staged (unsaved) annotation description popup, if 3a is ready */}
            {isCreating && staged && canReply && highlightRef && (
                <div className="ba-HighlightAnnotations-popup">
                    <PopupReply
                        isPending={isPending}
                        onCancel={handleCancel}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        reference={highlightRef}
                        value={message}
                    />
                </div>
            )}
        </>
    );
};

export default HighlightAnnotations;
