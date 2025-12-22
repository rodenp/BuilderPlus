
import { getHTML as getContainerHTML } from './src/components/canvas-components/container/getHTML';
import { getHTML as getInputHTML } from './src/components/canvas-components/input/getHTML';
import type { Theme } from './src/types/theme';

const mockTheme: Theme = {
    id: 'light',
    name: 'Light',
    mode: 'light',
    styles: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#333'
    }
};

const inputComponent = {
    id: 'input-1',
    type: 'input',
    props: {
        label: 'Test Input',
        placeholder: 'Type here...'
    }
};

const nestedContainer = {
    id: 'container-1',
    type: 'container',
    props: {
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderWidth: '2px',
        borderColor: '#333'
    },
    children: [
        {
            id: 'container-2',
            type: 'container',
            props: {
                padding: '20px',
                backgroundColor: '#e0e0e0',
                borderWidth: '2px',
                borderColor: '#666'
            },
            children: [
                inputComponent
            ]
        }
    ]
};

async function test() {
    console.log('--- Testing Container Recursion with Input ---');

    // Mock renderChildren to simulate strict recursive behavior
    const renderChildrenSpy = async (children: any[]) => {
        console.log(`renderChildren called with ${children.length} children`);
        const promises = children.map(async child => {
            if (child.type === 'input') {
                return await getInputHTML(child, mockTheme, async () => [], true);
            } else if (child.type === 'container') {
                // Determine children for container using callback
                // Note: The real implementation passes the actual child from the component
                return await getContainerHTML(child, mockTheme, renderChildrenSpy);
            } else {
                return `<div>Unknown ${child.type}</div>`;
            }
        });
        return Promise.all(promises);
    };

    try {
        const html = await getContainerHTML(nestedContainer as any, mockTheme, renderChildrenSpy);
        console.log('Resulting HTML:');
        console.log(html);

        if (html.includes('<input type="text" placeholder="Type here..."')) {
            console.log('\nSUCCESS: Input rendered deeply nested inside container!');
        } else {
            console.error('\nFAILURE: Input NOT found in output HTML');
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
