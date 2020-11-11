import { Path, PathGroup, Rect, SerializedError, Stroke } from '../../@types';

export enum CreatorStatus {
    init = 'init',
    pending = 'pending',
    rejected = 'rejected',
    staged = 'staged',
    started = 'started',
}

export type CreatorPathGroup = PathGroup & {
    id: string;
    paths: Array<CreatorPath>;
    stroke: Stroke;
};

export type CreatorPath = Path & {
    id: string;
};

export type CreatorItemBase = {
    location: number;
};

export type CreatorItemRegion = CreatorItemBase & {
    shape: Rect;
};

export type CreatorItemHighlight = CreatorItemBase & {
    shapes: Rect[];
};

export type CreatorItemDrawing = CreatorItemBase & {
    drawnPathGroups: Array<CreatorPathGroup>;
    stashedPathGroups: Array<CreatorPathGroup>;
};

export type CreatorItem = CreatorItemRegion | CreatorItemHighlight | CreatorItemDrawing | null;

export type CreatorState = {
    cursor: number;
    error: SerializedError | null;
    message: string;
    referenceId: string | null;
    staged: CreatorItem;
    status: CreatorStatus;
};
