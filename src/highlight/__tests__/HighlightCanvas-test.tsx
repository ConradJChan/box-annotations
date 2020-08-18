import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import HighlightCanvas, { Props } from '../HighlightCanvas';
import { rect as mockRect } from '../__mocks__/data';

describe('HighlightCanvas', () => {
    const defaults: Props = {
        shapes: [mockRect],
    };
    const getWrapper = (props?: Props): ShallowWrapper<Props, {}, HighlightCanvas> =>
        shallow(<HighlightCanvas {...defaults} {...props} />);

    test('componentDidMount()', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance() as HighlightCanvas;

        jest.spyOn(instance, 'scaleCanvas');
        jest.spyOn(instance, 'renderRects');

        instance.componentDidMount();

        expect(instance.scaleCanvas).toHaveBeenCalledTimes(1);
        expect(instance.renderRects).toHaveBeenCalledTimes(1);
    });

    test('componentDidUpdate()', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance() as HighlightCanvas;

        jest.spyOn(instance, 'clearCanvas');
        jest.spyOn(instance, 'renderRects');

        wrapper.setProps({ shapes: [] });

        expect(instance.clearCanvas).toHaveBeenCalledTimes(1);
        expect(instance.renderRects).toHaveBeenCalledTimes(1);
    });

    describe('getContext()', () => {
        test.each`
            canvasRef                      | expectedResult
            ${null}                        | ${null}
            ${{ getContext: () => 'ctx' }} | ${'ctx'}
        `('should return $expectedResult as context if canvasRef is $canvasRef', ({ canvasRef, expectedResult }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance() as HighlightCanvas;

            instance.canvasRef = { current: canvasRef };

            expect(instance.getContext()).toBe(expectedResult);
        });
    });

    describe('render()', () => {
        test('should render', () => {
            const wrapper = getWrapper();
            expect(wrapper.find('canvas').hasClass('ba-HighlightCanvas')).toBe(true);
        });
    });
});
