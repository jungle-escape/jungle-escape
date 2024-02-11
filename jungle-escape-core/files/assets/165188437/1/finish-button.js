var FinishButton = pc.createScript('finishButton');

FinishButton.attributes.add('triggerEntity', { type: 'entity' });
FinishButton.attributes.add('connectedEntity', { type: 'entity', description: 'Entity on which event will be triggered' });
FinishButton.attributes.add('positionYCurve', { type: 'curve' });
FinishButton.attributes.add('tags', { type: 'string', array: true, description: 'Only entities with this tags can trigger' });