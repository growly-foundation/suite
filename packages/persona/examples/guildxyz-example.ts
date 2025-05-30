import { createGuildClient } from '@guildxyz/sdk';

import { GuildXyzService } from '../src/services/guildxyz';

async function main() {
  const guildClient = createGuildClient('EXAMPLE');
  const guildService = new GuildXyzService(guildClient);
  const walletAddress = '0x87CA55485C2cbc6C3fe4fc152b624569467872B0';

  try {
    // Fetch user profile
    const profile = await guildService.fetchUserProfile(walletAddress);
    console.log('User Profile:', profile);

    // Fetch all guild memberships for the address
    const memberships = await guildService.fetchUserMembership(walletAddress);
    console.log('Guild Memberships:', memberships);

    if (memberships.length > 0) {
      const guildId = memberships[0].guildId;

      // Fetch specific guild membership
      const specificGuildMembership = await guildService.fetchUserGuildMembership(
        walletAddress,
        guildId
      );
      console.log('Specific Guild Membership:', specificGuildMembership);

      // Fetch guild details
      const guild = await guildService.fetchGuild(guildId);
      console.log('Guild:', guild);

      if (guild) {
        // Fetch all roles in the guild
        const roles = await guildService.fetchRoleNames(guildId);
        console.log('Guild Roles:', roles);

        // For each role, fetch its rewards and requirements
        for (const role of roles) {
          console.log(`\nDetails for Role: ${role.name}`);

          const rewards = await guildService.fetchRoleRewards(guildId, role.id);
          console.log('Role Rewards:', rewards);

          const requirements = await guildService.fetchRoleRequirements(guildId, role.id);
          console.log('Role Requirements:', requirements);
        }

        // Fetch guild-wide rewards
        const guildRewards = await guildService.fetchGuildRewards(guildId);
        console.log('\nGuild-wide Rewards:', guildRewards);

        // Get user's rank in guild
        // Using default platform ID 1 - adjust as needed for your guild
        const guildPlatformId = 1;
        const rankInGuild = await guildService.fetchRankInGuild(
          walletAddress,
          guildId,
          guildPlatformId
        );
        console.log('\nRank in Guild:', rankInGuild);
      }
    }

    // Example of fetching multiple guilds at once
    const multipleGuildIds = memberships.slice(0, 3).map((m: { guildId: number }) => m.guildId);
    const guilds = await guildService.fetchGuilds(multipleGuildIds);
    console.log('\nMultiple Guilds:', guilds);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
