import {
  AggregatedWorkflow,
  ParsedStep,
  UIEventCondition,
  UserDefinedPayload,
} from '@getgrowly/core';
import { suiteCoreService } from '@/services/core.service';
import { useSuiteSession } from '@/hooks/use-session';
import { useEffect, useCallback, useState } from 'react';
import { useSuite } from '@/hooks/use-suite';
import { useChatActions } from '@/hooks/use-chat-actions';

let executing = false;

export const WorkflowExecutionObserver: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agentId, organizationApiKey } = useSuite();
  const { workflowExecutionService, initWorkflowExecutionService, setPanelOpen } =
    useSuiteSession();
  const { textAgentMessage, generateAgentMessage } = useChatActions();
  const { user } = useSuiteSession();
  const [growlyElementMap, setGrowlyElementMap] = useState<Map<Element, UserDefinedPayload>>(
    new Map()
  );

  const executeStep = useCallback(
    async (step: ParsedStep) => {
      if (!user?.id || !agentId) return;
      if (executing) return;
      executing = true;
      const stepSessionPayload = {
        step_id: step.id,
        user_id: user.id,
        agent_id: agentId,
      };
      const existingStepSession = await suiteCoreService.callDatabaseService(
        'step_sessions',
        'getOneByFields',
        [stepSessionPayload]
      );
      console.log('existingStepSession', existingStepSession, step.is_repeat);
      if (existingStepSession && !step.is_repeat) return;
      await suiteCoreService.callDatabaseService('step_sessions', 'create', [stepSessionPayload]);
      for (const action of step.action) {
        if (action.type === 'text') {
          console.log(`TextAction: ${action.return.text}`);
          await textAgentMessage(action.return.text);
        } else if (action.type === 'agent') {
          console.log(`AgentAction prompt: ${action.args.prompt}`);
          await generateAgentMessage(action.args.prompt);
        }
      }
      executing = false;
    },
    [user, agentId, textAgentMessage, generateAgentMessage, setPanelOpen]
  );

  const handleGrowlyMouseEvent = async (event: MouseEvent, condition: UIEventCondition) => {
    if (!workflowExecutionService) return;

    const target = event.target as HTMLElement;

    // Use identity check against the map (no DOM walk)
    const action = growlyElementMap.get(target);
    if (!action || action.type !== 'step') return;

    console.log('Growly Suite: Action triggered', target);
    await workflowExecutionService.triggerUIEvent(
      condition,
      action.payload.id,
      action.payload.conditions
    );
  };

  const handleGrowlyClick = async (e: MouseEvent) =>
    await handleGrowlyMouseEvent(e, UIEventCondition.OnClicked);

  const handleGrowlyMouseEnter = async (e: MouseEvent) =>
    await handleGrowlyMouseEvent(e, UIEventCondition.OnHovered);

  const handlePageLoad = async () => {
    await workflowExecutionService?.triggerUIEvent(UIEventCondition.OnPageLoad);
  };

  const handleVisited = async () => {
    await workflowExecutionService?.triggerUIEvent(UIEventCondition.OnVisited);
  };

  const updateGrowlyMap = (nodes: NodeList | Node[]) => {
    nodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      if (node.hasAttribute('data-growly')) {
        try {
          const data: UserDefinedPayload = JSON.parse(node.getAttribute('data-growly')!);
          setGrowlyElementMap(growlyElementMap.set(node, data));
        } catch (err) {
          console.warn('Invalid data-growly JSON:', node.getAttribute('data-growly'));
        }
      }
      // Check children too
      node.querySelectorAll?.('[data-growly]')?.forEach(child => {
        try {
          const data: UserDefinedPayload = JSON.parse(child.getAttribute('data-growly')!);
          setGrowlyElementMap(growlyElementMap.set(child, data));
        } catch (err) {
          console.warn('Invalid data-growly JSON in child:', child.getAttribute('data-growly'));
        }
      });
    });
  };

  const removeGrowlyFromMap = (nodes: NodeList | Node[]) => {
    nodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      growlyElementMap.delete(node);
      node.querySelectorAll?.('[data-growly]')?.forEach(child => {
        growlyElementMap.delete(child);
      });
    });
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) updateGrowlyMap(mutation.addedNodes);
      if (mutation.removedNodes.length) removeGrowlyFromMap(mutation.removedNodes);
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  useEffect(() => {
    async function evaluateAndExecuteAgentWorkflows() {
      if (!agentId || !organizationApiKey) return;
      try {
        const workflows = await suiteCoreService.call<'workflows', AggregatedWorkflow[]>(
          'workflows',
          'getWorkflowsByAgentId',
          [agentId]
        );
        initWorkflowExecutionService(workflows, executeStep);
      } catch (error) {
        console.error(`Growly Suite Execution Error: ${error}`);
      }
    }
    evaluateAndExecuteAgentWorkflows();
  }, [agentId, organizationApiKey]);

  useEffect(() => {
    if (!workflowExecutionService) return;
    document.addEventListener('click', handleGrowlyClick);
    document.addEventListener('mouseenter', handleGrowlyMouseEnter);
    document.addEventListener('DOMContentLoaded', handlePageLoad);
    window.addEventListener('pageshow', handleVisited);

    return () => {
      document.removeEventListener('click', handleGrowlyClick);
      document.removeEventListener('mouseenter', handleGrowlyMouseEnter);
      document.removeEventListener('DOMContentLoaded', handlePageLoad);
      window.removeEventListener('pageshow', handleVisited);
    };
  }, [workflowExecutionService]);

  return <>{children}</>;
};
