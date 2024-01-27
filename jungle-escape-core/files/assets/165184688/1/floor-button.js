var FloorButton = pc.createScript('floorButton');

FloorButton.attributes.add('triggerEntity', { type: 'entity' });
FloorButton.attributes.add('connectedEntity', { type: 'entity', description: 'Entity on which event will be triggered' });
FloorButton.attributes.add('positionYCurve', { type: 'curve' });
FloorButton.attributes.add('tags', { type: 'string', array: true, description: 'Only entities with this tags can trigger' });