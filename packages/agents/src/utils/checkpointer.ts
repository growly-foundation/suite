import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

export const createCheckpointer = async () => {
  const checkpointer = PostgresSaver.fromConnString(process.env.POSTGRES_CONNECTION_STRING || '');
  if (!checkpointer) {
    throw new Error('Failed to create checkpointer');
  }
  await checkpointer.setup();
  return checkpointer;
};

export const getCheckpointer = async () => {
  const checkpointer = await createCheckpointer();
  return checkpointer;
};
