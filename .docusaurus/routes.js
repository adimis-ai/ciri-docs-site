import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'e0c'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '305'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '1e6'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '4a8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/components',
                component: ComponentCreator('/docs/architecture/components', '123'),
                exact: true
              },
              {
                path: '/docs/architecture/components-deep',
                component: ComponentCreator('/docs/architecture/components-deep', '378'),
                exact: true
              },
              {
                path: '/docs/architecture/core-harness',
                component: ComponentCreator('/docs/architecture/core-harness', '9cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/overview',
                component: ComponentCreator('/docs/architecture/overview', '833'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/skills-toolkits',
                component: ComponentCreator('/docs/architecture/skills-toolkits', '8fe'),
                exact: true
              },
              {
                path: '/docs/built-in-skills/',
                component: ComponentCreator('/docs/built-in-skills/', '923'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cli-reference',
                component: ComponentCreator('/docs/cli-reference', '519'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cli-reference-advanced',
                component: ComponentCreator('/docs/cli-reference-advanced', '681'),
                exact: true
              },
              {
                path: '/docs/contributing',
                component: ComponentCreator('/docs/contributing', '069'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/build-packaging',
                component: ComponentCreator('/docs/development/build-packaging', '9b6'),
                exact: true
              },
              {
                path: '/docs/development/run-debug',
                component: ComponentCreator('/docs/development/run-debug', 'b5a'),
                exact: true
              },
              {
                path: '/docs/development/setup',
                component: ComponentCreator('/docs/development/setup', '213'),
                exact: true
              },
              {
                path: '/docs/development/tests-lint',
                component: ComponentCreator('/docs/development/tests-lint', '793'),
                exact: true
              },
              {
                path: '/docs/examples',
                component: ComponentCreator('/docs/examples', '2c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/faq',
                component: ComponentCreator('/docs/faq', '947'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/autocomplete',
                component: ComponentCreator('/docs/features/autocomplete', 'e44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/hitl',
                component: ComponentCreator('/docs/features/hitl', '5b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/memory',
                component: ComponentCreator('/docs/features/memory', 'def'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/script-executor',
                component: ComponentCreator('/docs/features/script-executor', '128'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/web-research',
                component: ComponentCreator('/docs/features/web-research', '4f3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '2a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/internals/controller',
                component: ComponentCreator('/docs/internals/controller', '7a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/internals/graph-execution',
                component: ComponentCreator('/docs/internals/graph-execution', 'd60'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/internals/middlewares',
                component: ComponentCreator('/docs/internals/middlewares', 'd76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/internals/self-evolution',
                component: ComponentCreator('/docs/internals/self-evolution', '6eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/roadmap',
                component: ComponentCreator('/docs/roadmap', 'ced'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/security',
                component: ComponentCreator('/docs/security', '3ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/skills-guide',
                component: ComponentCreator('/docs/skills-guide', 'cb2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/subagents-guide',
                component: ComponentCreator('/docs/subagents-guide', 'f9e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/toolkits-guide',
                component: ComponentCreator('/docs/toolkits-guide', '436'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/',
                component: ComponentCreator('/docs/use-cases/', '271'),
                exact: true
              },
              {
                path: '/docs/use-cases/advanced-research',
                component: ComponentCreator('/docs/use-cases/advanced-research', '4aa'),
                exact: true
              },
              {
                path: '/docs/use-cases/code-refactor',
                component: ComponentCreator('/docs/use-cases/code-refactor', '0a0'),
                exact: true
              },
              {
                path: '/docs/use-cases/release-automation',
                component: ComponentCreator('/docs/use-cases/release-automation', 'b00'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
