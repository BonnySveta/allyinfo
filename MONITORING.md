# Руководство по мониторингу

## Метрики

### Производительность

- Время загрузки страницы
- Время до интерактивности
- Время до первого байта
- Время ответа API

### Доступность

- Uptime
- Время отклика
- Коды ответов
- Ошибки

### Безопасность

- Попытки взлома
- Подозрительная активность
- Утечки данных
- SSL сертификаты

## Инструменты

### Логирование

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Трейсинг

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('allys-library');

const span = tracer.startSpan('operation');
try {
  // Операция
} catch (error) {
  span.recordException(error);
  throw error;
} finally {
  span.end();
}
```

### Алерты

```typescript
import { AlertManager } from './alert-manager';

const alertManager = new AlertManager({
  slack: {
    webhook: process.env.SLACK_WEBHOOK
  },
  email: {
    from: 'alerts@allys-library.com',
    to: 'team@allys-library.com'
  }
});

alertManager.alert({
  level: 'error',
  message: 'Критическая ошибка',
  context: {
    service: 'api',
    error: error.message
  }
});
```

## Мониторинг приложения

### Health Checks

```typescript
import express from 'express';
import { healthCheck } from './health';

const app = express();

app.get('/health', async (req, res) => {
  const health = await healthCheck();
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
```

### Метрики Prometheus

```typescript
import { Registry, Counter, Histogram } from 'prom-client';

const registry = new Registry();

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

registry.registerMetric(httpRequestDuration);
```

### Grafana дашборды

```json
{
  "dashboard": {
    "id": null,
    "title": "Allys Library Metrics",
    "panels": [
      {
        "title": "HTTP Requests",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_count[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      }
    ]
  }
}
```

## Мониторинг инфраструктуры

### Контейнеры

```yaml
# docker-compose.yml
version: '3'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### База данных

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const checkDatabase = async () => {
  try {
    await pool.query('SELECT 1');
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};
```

## Алертинг

### Правила

```yaml
# alertmanager.yml
groups:
  - name: allys-library
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate
          description: Error rate is above 10% for 5 minutes
```

### Уведомления

```typescript
const notify = async (alert) => {
  // Slack
  await slack.send({
    channel: '#alerts',
    text: `🚨 ${alert.summary}\n${alert.description}`
  });

  // Email
  await email.send({
    to: 'team@allys-library.com',
    subject: `[${alert.severity}] ${alert.summary}`,
    text: alert.description
  });
};
```

## Логирование

### Структура логов

```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  message: string;
  context: Record<string, any>;
  traceId?: string;
}
```

### Ротация логов

```typescript
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    })
  ]
});
```

## Метрики бизнеса

### Пользователи

```typescript
const userMetrics = {
  totalUsers: 0,
  activeUsers: 0,
  newUsers: 0,
  churnRate: 0
};

const updateUserMetrics = async () => {
  const now = new Date();
  const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

  userMetrics.totalUsers = await User.count();
  userMetrics.activeUsers = await User.count({
    where: {
      lastActive: {
        gte: lastMonth
      }
    }
  });
};
```

### Контент

```typescript
const contentMetrics = {
  totalResources: 0,
  publishedResources: 0,
  averageRating: 0,
  totalViews: 0
};

const updateContentMetrics = async () => {
  contentMetrics.totalResources = await Resource.count();
  contentMetrics.publishedResources = await Resource.count({
    where: {
      status: 'published'
    }
  });
};
```

## Лучшие практики

1. Используйте централизованное логирование
2. Настройте алерты на критические события
3. Создайте дашборды для ключевых метрик
4. Регулярно проверяйте состояние системы
5. Настройте автоматическое восстановление
6. Ведите историю инцидентов
7. Анализируйте тренды
8. Оптимизируйте на основе метрик
9. Документируйте процедуры
10. Проводите регулярные проверки

## Инструменты

### Мониторинг

- Prometheus
- Grafana
- New Relic
- Datadog

### Логирование

- ELK Stack
- Graylog
- Papertrail
- CloudWatch

### Алертинг

- PagerDuty
- OpsGenie
- VictorOps
- AlertManager

## Поддержка

- Документация: [docs/](docs/)
- Issues: [issues/](issues/)
- Чат: #monitoring в Slack 