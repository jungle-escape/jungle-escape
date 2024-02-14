var RbnodeConnector = pc.createScript('rbnodeConnector');

RbnodeConnector.attributes.add("speed", { type: "number" });
RbnodeConnector.attributes.add("height", { type: "number" });
RbnodeConnector.attributes.add('connNode1', {
    type: 'entity',
    title: 'Target1',
    description: 'The target node column, which is supposed to rise or fall per its validity.'
});

RbnodeConnector.attributes.add('connNode2', {
    type: 'entity',
    title: 'Target2',
    description: 'The target node column, which is supposed to rise or fall per its validity.'
});

