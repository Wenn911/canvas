import React, {useEffect, useRef } from "react";
import { Circle, Group, Rect, Transformer} from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, connectArrow}) => {

    const dotRef = useRef()
    const groupRef = useRef()
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);


    const handleDeleteRect = () => {
        const node = groupRef.current
        node.destroy()
        // localStorage.removeItem()
    }
    return (
            <Group
                onContextMenu={handleDeleteRect}
                ref={groupRef}
            >
                <Rect

                    onClick={onSelect}
                    onTap={onSelect}
                    {...shapeProps}
                    draggable
                    ref={shapeRef}
                    onDragEnd={(e) => {
                        onChange({
                            ...shapeProps,
                            x: e.target.x(),
                            y: e.target.y(),
                        });
                    }}
                    onTransformEnd={(e) => {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        //Here i want saves transform X and Y to localStorage
                        const transform = node.getAbsolutePosition()
                        console.log(transform)

                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...shapeProps,
                            x: node.x(),
                            y: node.y(),
                            // set minimal value
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(node.height() * scaleY),
                        });
                    }}
                />
                <Circle
                    {...shapeProps}
                    x={shapeProps.x + (shapeProps.width / 2)}
                    y={shapeProps.y}
                    ref={dotRef}
                    radius={10}
                    width={10}
                    height={10}
                    fill='black'
                    onClick={connectArrow}
                />
                {isSelected && (
                    <Transformer
                        ref={trRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                )}
            </Group>
    );
};

export default Rectangle