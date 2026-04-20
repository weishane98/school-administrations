import { updateClassroom } from '../updateClassroom';

jest.mock('../../../models', () => ({
  classroom: {
    findOne: jest.fn(),
  },
}));

// Sequelize models are exported via CommonJS.
// Using require here for compatibility with the existing setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../../models');

describe('updateClassroom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update classroom name when found', async () => {
    const updateMock = jest.fn();

    db.classroom.findOne.mockResolvedValue({
      name: 'Old Name',
      update: updateMock,
    });

    await updateClassroom('A1', 'New Name');

    expect(updateMock).toHaveBeenCalledWith({ name: 'New Name' });
  });

  it('should not update if name is the same', async () => {
    const updateMock = jest.fn();

    db.classroom.findOne.mockResolvedValue({
      name: 'Same Name',
      update: updateMock,
    });

    await updateClassroom('A1', 'Same Name');

    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should throw error if classroom not found', async () => {
    db.classroom.findOne.mockResolvedValue(null);

    await expect(updateClassroom('A1', 'New Name'))
      .rejects
      .toThrow('Classroom is not found.');
  });
});