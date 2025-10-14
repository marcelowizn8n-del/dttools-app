import { Client } from '@notionhq/client';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=notion',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Notion not connected');
  }
  return accessToken;
}

export async function getUncachableNotionClient() {
  const accessToken = await getAccessToken();
  return new Client({ auth: accessToken });
}

export interface NotionExportOptions {
  parentPageId?: string;
  createNewPage?: boolean;
}

export async function exportProjectToNotion(
  projectData: any,
  options: NotionExportOptions = {}
): Promise<string> {
  const notion = await getUncachableNotionClient();

  const { parentPageId, createNewPage = true } = options;

  const pageTitle = projectData.name || 'Projeto Design Thinking';
  
  const children: any[] = [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ type: 'text', text: { content: pageTitle } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: projectData.description || 'Sem descrição' }
        }]
      }
    },
    {
      object: 'block',
      type: 'divider',
      divider: {}
    }
  ];

  if (projectData.empathyMaps && projectData.empathyMaps.length > 0) {
    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🎯 Fase 1: Empatizar' } }]
      }
    });

    children.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{ type: 'text', text: { content: 'Mapas de Empatia' } }]
      }
    });

    projectData.empathyMaps.forEach((map: any) => {
      children.push({
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '🗺️' },
          rich_text: [{ type: 'text', text: { content: map.title || 'Mapa de Empatia' } }]
        }
      });

      if (map.says) {
        children.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Diz: ${map.says}` }
            }]
          }
        });
      }

      if (map.thinks) {
        children.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Pensa: ${map.thinks}` }
            }]
          }
        });
      }

      if (map.does) {
        children.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Faz: ${map.does}` }
            }]
          }
        });
      }

      if (map.feels) {
        children.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Sente: ${map.feels}` }
            }]
          }
        });
      }
    });
  }

  if (projectData.personas && projectData.personas.length > 0) {
    children.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{ type: 'text', text: { content: 'Personas' } }]
      }
    });

    projectData.personas.forEach((persona: any) => {
      children.push({
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '👤' },
          rich_text: [{ 
            type: 'text', 
            text: { content: `${persona.name} - ${persona.age} anos` }
          }]
        }
      });

      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ 
            type: 'text', 
            text: { content: persona.bio || '' }
          }]
        }
      });

      if (persona.goals) {
        children.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Objetivos: ${persona.goals}` }
            }]
          }
        });
      }

      if (persona.frustrations) {
        children.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Frustrações: ${persona.frustrations}` }
            }]
          }
        });
      }
    });
  }

  if (projectData.povStatements && projectData.povStatements.length > 0) {
    children.push({
      object: 'block',
      type: 'divider',
      divider: {}
    });

    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🎯 Fase 2: Definir' } }]
      }
    });

    projectData.povStatements.forEach((pov: any) => {
      children.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ 
            type: 'text', 
            text: { content: pov.statement || pov.user || '' }
          }]
        }
      });
    });
  }

  if (projectData.ideas && projectData.ideas.length > 0) {
    children.push({
      object: 'block',
      type: 'divider',
      divider: {}
    });

    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '💡 Fase 3: Idear' } }]
      }
    });

    projectData.ideas.forEach((idea: any) => {
      children.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ 
            type: 'text', 
            text: { content: idea.title || idea.description || '' }
          }]
        }
      });

      if (idea.description && idea.title) {
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ 
              type: 'text', 
              text: { content: idea.description }
            }]
          }
        });
      }
    });
  }

  if (projectData.prototypes && projectData.prototypes.length > 0) {
    children.push({
      object: 'block',
      type: 'divider',
      divider: {}
    });

    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🔨 Fase 4: Prototipar' } }]
      }
    });

    projectData.prototypes.forEach((prototype: any) => {
      children.push({
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '🔨' },
          rich_text: [{ 
            type: 'text', 
            text: { content: prototype.name || 'Protótipo' }
          }]
        }
      });

      if (prototype.description) {
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ 
              type: 'text', 
              text: { content: prototype.description }
            }]
          }
        });
      }
    });
  }

  if (projectData.tests && projectData.tests.length > 0) {
    children.push({
      object: 'block',
      type: 'divider',
      divider: {}
    });

    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '✅ Fase 5: Testar' } }]
      }
    });

    projectData.tests.forEach((test: any) => {
      children.push({
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '🧪' },
          rich_text: [{ 
            type: 'text', 
            text: { content: test.title || test.methodology || 'Teste' }
          }]
        }
      });

      if (test.findings) {
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `Resultados: ${test.findings}` }
            }]
          }
        });
      }
    });
  }

  if (createNewPage) {
    if (!parentPageId) {
      throw new Error('Notion requer um Parent Page ID. Crie uma página raiz no Notion e compartilhe com a integração.');
    }

    const pagePayload: any = {
      parent: { page_id: parentPageId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: pageTitle
              }
            }
          ]
        }
      },
      children: children.slice(0, 100)
    };

    const response = await notion.pages.create(pagePayload);

    if (children.length > 100) {
      const remainingBlocks = children.slice(100);
      for (let i = 0; i < remainingBlocks.length; i += 100) {
        const chunk = remainingBlocks.slice(i, i + 100);
        await notion.blocks.children.append({
          block_id: response.id,
          children: chunk
        });
      }
    }

    return response.id;
  } else {
    throw new Error('Exportação sem criar página nova ainda não implementada');
  }
}
