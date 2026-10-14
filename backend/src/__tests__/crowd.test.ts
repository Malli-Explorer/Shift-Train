import { crowdStore } from '../services/crowdStore';

describe('Crowd Store & In-Memory Logic Tests', () => {
  beforeEach(() => {
    crowdStore.clear();
  });

  test('14. Valid report is recorded into memory', () => {
    const res = crowdStore.validateAndAdd({
      trainId: '99011',
      coach: 'B1',
      crowdLevel: 'HIGH',
      comment: 'Very crowded near doors'
    });
    expect(res.success).toBe(true);
    expect(res.report?.id).toBeDefined();
    expect(res.report?.trainId).toBe('99011');
    expect(crowdStore.getAll().length).toBe(1);
  });

  test('15. Missing required fields fails validation', () => {
    const res = crowdStore.validateAndAdd({
      trainId: '',
      coach: '',
      crowdLevel: ''
    });
    expect(res.success).toBe(false);
    expect(res.errorKey).toBe('invalidPayload');
  });

  test('16. Duplicate submission in short time window is rejected', () => {
    const first = crowdStore.validateAndAdd({
      trainId: '99011',
      coach: 'B1',
      crowdLevel: 'HIGH',
      reporterIp: '127.0.0.1'
    });
    expect(first.success).toBe(true);

    const duplicate = crowdStore.validateAndAdd({
      trainId: '99011',
      coach: 'B1',
      crowdLevel: 'HIGH',
      reporterIp: '127.0.0.1'
    });
    expect(duplicate.success).toBe(false);
    expect(duplicate.errorKey).toBe('duplicateReport');
  });

  test('17. Different coach or train is not flagged as duplicate', () => {
    crowdStore.validateAndAdd({
      trainId: '99011',
      coach: 'B1',
      crowdLevel: 'HIGH'
    });
    const differentCoach = crowdStore.validateAndAdd({
      trainId: '99011',
      coach: 'B2',
      crowdLevel: 'HIGH'
    });
    expect(differentCoach.success).toBe(true);
    expect(crowdStore.getAll().length).toBe(2);
  });

  test('18. Comments exceeding 500 characters trigger size limit error', () => {
    const hugeComment = 'A'.repeat(501);
    const res = crowdStore.validateAndAdd({
      trainId: '99022',
      coach: 'D1',
      crowdLevel: 'MEDIUM',
      comment: hugeComment
    });
    expect(res.success).toBe(false);
    expect(res.errorKey).toBe('sizeLimitExceeded');
  });

  test('19. Querying by train filters correctly and resets on clear', () => {
    crowdStore.validateAndAdd({ trainId: '99011', coach: 'S1', crowdLevel: 'LOW' });
    crowdStore.validateAndAdd({ trainId: '99022', coach: 'C1', crowdLevel: 'HIGH' });

    expect(crowdStore.getByTrain('99011').length).toBe(1);
    expect(crowdStore.getByTrain('99022').length).toBe(1);
    expect(crowdStore.getByTrain('99033').length).toBe(0);

    crowdStore.clear();
    expect(crowdStore.getAll().length).toBe(0);
  });
});
