import React from 'react';

// SIMULATED EXTERNAL IMPORT
// In a real app, this would be: import { ... } from 'builderplus';
import {
    registerPlugin,
    ContainerDroppable,
    type CanvasComponentProps
} from './src/sdk';

// ============================================================================
// EXAMPLE: A "CRM" APP CONSUMING THE BUILDER
// This code lives outside the core builder codebase.
// ============================================================================

// 1. Define a "Deal Card" Component
const CrmDealCard: React.FC<CanvasComponentProps> = ({ component, commonStyles }) => {
    const { props } = component;
    return (
        <div style={{
            padding: '12px',
            background: 'white',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${(props.value as number) > 1000 ? 'green' : 'orange'} `,
            ...commonStyles
        }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{props.dealName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
                ${props.value} • {props.owner}
            </div>
        </div>
    );
};

// 2. Define a "Pipeline Stage" Container
const CrmStage: React.FC<CanvasComponentProps> = ({ component, builderContext, canvasTheme, uiTheme, commonStyles }) => {
    const { props } = component;
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#f3f4f6',
            padding: '8px',
            borderRadius: '8px',
            width: '280px',
            ...commonStyles
        }}>
            <div style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                padding: '0 4px',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>{props.stageName}</span>
                <span style={{ background: '#e5e7eb', borderRadius: '12px', padding: '0 8px', fontSize: '12px' }}>
                    {(component.children || []).length}
                </span>
            </div>

            {/* The Magic: Using the SDK's ContainerDroppable to accept drops */}
            <ContainerDroppable
                containerId={component.id}
                containerType={component.type}
                children={component.children || []}
                builderContext={builderContext}
                theme={uiTheme}
                canvasTheme={canvasTheme}
                style={{ flex: 1, minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                emptyContent={<div style={{ textAlign: 'center', color: '#999', fontSize: '12px', padding: '20px' }}>Drop Deals Here</div>}
            />
        </div>
    );
};

// 3. Register the CRM Plugin
export function initCrmApp() {

    // Register the Deal Item
    registerPlugin({
        type: 'crm-deal',
        label: 'Deal Card',
        category: 'crm' as any, // Cast to any to bypass strict category check for this example
        icon: 'DollarSign',
        description: 'A sales opportunity',
        render: ({ props, styles }) => <CrmDealCard component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} />,
        defaultProps: { dealName: 'New Deal', value: 500, owner: 'Sales Rep' },
        properties: [
            { key: 'dealName', label: 'Deal Name', type: 'text', group: 'content' },
            { key: 'value', label: 'Value ($)', type: 'number', group: 'content' },
            { key: 'owner', label: 'Owner', type: 'text', group: 'content' },
        ]
    });

    // Register the Stage Container
    registerPlugin({
        type: 'crm-stage',
        label: 'Pipeline Stage',
        category: 'crm' as any,
        icon: 'Columns',
        description: 'A stage in the sales pipeline',
        isContainer: true,
        allowedChildren: ['crm-deal'], // Strict Rule: Only accepts Deals!
        customContainerRenderer: CrmStage,
        defaultProps: { stageName: 'Prospecting' },
        properties: [
            { key: 'stageName', label: 'Stage Name', type: 'text', group: 'content' }
        ],
        render: () => null // Placeholder for container
    });

    console.log('CRM Plugin Initialized via SDK!');
}
