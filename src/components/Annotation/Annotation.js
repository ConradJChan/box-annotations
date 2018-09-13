// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import Avatar from 'box-react-ui/lib/components/avatar';

import CommentText from '../../../third-party/components/CommentText';
import CommentInlineError from '../../../third-party/components/CommentInlineError';
import Internationalize from '../Internationalize';
import AnnotationHeader from './AnnotationHeader';
import withFocus from '../withFocus';

import './Annotation.scss';

type Props = {
    id: string,
    message: string,
    permissions: AnnotationPermissions,
    createdAt?: string,
    createdBy?: User,
    modifiedAt?: string,
    onDelete?: Function,
    isPending?: boolean,
    error?: ActionItemError,
    language?: string,
    messages?: StringMap,
    className: string,
    onBlur: Function,
    onFocus: Function
};

const Annotation = ({
    id,
    isPending = false,
    error,
    createdAt,
    createdBy,
    permissions,
    message,
    onDelete = noop,
    className,
    onBlur,
    onFocus,
    language,
    messages: intlMessages
}: Props) => (
    <Internationalize language={language} messages={intlMessages}>
        <div
            className={classNames(`ba-annotation ${className}`, {
                'ba-is-pending': isPending || error
            })}
            onBlur={onBlur}
            onFocus={onFocus}
        >
            <div className='ba-annotation-content'>
                <Avatar className='ba-annotation-avatar' {...createdBy} />
                <div className='ba-annotation-text'>
                    <AnnotationHeader
                        id={id}
                        permissions={permissions}
                        onDelete={onDelete}
                        createdAt={createdAt}
                        createdBy={createdBy}
                        isPending={isPending}
                    />
                    <CommentText id={id} tagged_message={message} translationEnabled={false} />
                </div>
            </div>
            {error && <CommentInlineError {...error} />}
        </div>
    </Internationalize>
);

export { Annotation as AnnotationComponent };
export default withFocus(Annotation);