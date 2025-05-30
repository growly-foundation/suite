import { AggregatedOrganization } from '@/models/organizations';

import { PublicDatabaseService } from './database.service';
import { FunctionService } from './function.service';
import { WorkflowService } from './workflow.service';

export class OrganizationService {
  constructor(
    private organizationDatabaseService: PublicDatabaseService<'organizations'>,
    private adminOrganizationDatabaseService: PublicDatabaseService<'admin_organizations'>,
    private agentDatabaseService: PublicDatabaseService<'agents'>,
    private workflowService: WorkflowService,
    private functionService: FunctionService
  ) {}

  async getOrganizationsByAdminId(admin_id: string): Promise<AggregatedOrganization[]> {
    const aggregatedOrganizations: AggregatedOrganization[] = [];
    const organizationIds = await this.functionService.invoke('get_admin_organizations', {
      p_admin_id: admin_id,
    });
    for (const { organization_id } of organizationIds) {
      const organization = await this.organizationDatabaseService.getById(organization_id);
      if (!organization) throw new Error('No organization found');
      const workflows = await this.workflowService.getWorkflowsByOrganizationId(organization_id);
      const agents = await this.agentDatabaseService.getAllByFields({
        organization_id,
      });
      aggregatedOrganizations.push({ ...organization, workflows, agents });
    }
    return aggregatedOrganizations;
  }

  async createOrganization(
    name: string,
    description: string,
    admin_id: string
  ): Promise<AggregatedOrganization> {
    const organization = await this.organizationDatabaseService.create({
      name,
      description,
    });
    const existingAssociation = await this.adminOrganizationDatabaseService.getOneByFields({
      admin_id,
      organization_id: organization.id,
    });
    if (!existingAssociation) {
      await this.adminOrganizationDatabaseService.create({
        admin_id,
        organization_id: organization.id,
      });
    }
    return {
      ...organization,
      workflows: [],
      agents: [],
    };
  }
}
