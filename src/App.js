import React, {useEffect, useState} from 'react';
import {Stage, Layer, Text, Arrow} from 'react-konva';
import Rectangle from "./components/Rectangle";

const App = () => {
    const [rectangles, setRectangles] = useState(JSON.parse(localStorage.getItem('rect')) || []);
    const [selectedId, selectShape] = useState(null);
    const [fromShapeId, setFromShapeId] = useState(null);
    const [connectors, setConnectors] = useState(JSON.parse(localStorage.getItem('connects')) || []);

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const handleAddRectangle = () => {
        //add new rect
            const newRectangle = {
                x: 100,
                y: 100,
                width: 100,
                height: 100,
                strokeWidth: 1,
                stroke: 'black',
                id: Math.random(),
            };
            setRectangles([...rectangles, newRectangle]);
    }
    const clearedStorage = () => {
        localStorage.clear()
    }

    useEffect(() => {
        localStorage.setItem('rect', JSON.stringify(rectangles))
    }, [rectangles])

    useEffect(() => {
        localStorage.setItem('connects', JSON.stringify(connectors))
    }, [connectors])

    return (

        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            onDblClick={clearedStorage}
        >
            <Layer>
                <Text text='Add new rectangle(click on text)' fontSize={25} onClick={handleAddRectangle}></Text>
                {connectors.map(con => {
                    const from = rectangles.find(s => s.id === con.from);
                    const to = rectangles.find(s => s.id === con.to);
                    const fromX = from.x + (from.width / 2)
                    const toX = to.x + (to.width / 2)

                    return (
                        <Arrow
                            key={con.id}
                            points={[fromX, from.y, toX, to.y]}
                            stroke="black"
                        />
                    );
                })}
                {rectangles.map((rect, i) => {
                    return (
                        <Rectangle
                            key={i}
                            shapeProps={rect}
                            isSelected={rect.id === selectedId}
                            onSelect={() => {
                                selectShape(rect.id);
                            }}
                            onChange={(newAttrs) => {
                                const rects = rectangles.slice();
                                rects[i] = newAttrs;
                                setRectangles(rects);
                            }}
                            connectArrow={() => {
                                if (fromShapeId) {
                                    const newConnector = {
                                        from: fromShapeId,
                                        to: rect.id,
                                        id: Math.random()
                                    };
                                    setConnectors(connectors.concat([newConnector]));
                                    setFromShapeId(null);
                                } else {
                                    setFromShapeId(rect.id);
                                }}}

                        />
                    );
                })}

            </Layer>
        </Stage>
    );
};

export default App

