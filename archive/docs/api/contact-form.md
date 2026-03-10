# API Documentation — Contact Form

> **Base URL:** `https://api.tankmentor.com/v1`
>
> **Last Updated:** 2026-03-05

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Create Contact Form](#2-create-contact-form)
  - [2.1. Endpoint](#21-endpoint)
  - [2.2. Headers](#22-headers)
  - [2.3. Request Body](#23-request-body)
  - [2.4. Validation Rules](#24-validation-rules)
  - [2.5. Response — Success](#25-response--success)
  - [2.6. Response — Error](#26-response--error)
- [3. Data Dictionary](#3-data-dictionary)
- [4. Rate Limiting](#4-rate-limiting)
- [5. Example — cURL](#5-example--curl)
- [6. Example — JavaScript (Fetch)](#6-example--javascript-fetch)
- [7. Sequence Diagram](#7-sequence-diagram)

---

## 1. Overview

API quản lý form liên hệ của website TankMentor. Cho phép khách hàng gửi yêu cầu tư vấn, đặt câu hỏi hoặc đăng ký nhận thông tin về các chương trình đào tạo BA/PM.

| Attribute         | Value                        |
| ----------------- | ---------------------------- |
| **Protocol**      | HTTPS                        |
| **Format**        | JSON                         |
| **Authentication**| Không bắt buộc (public API)  |
| **Rate Limit**    | 5 requests / phút / IP       |

---

## 2. Create Contact Form

### 2.1. Endpoint

```
POST /contacts
```

Tạo mới một form liên hệ. Hệ thống sẽ lưu thông tin và gửi email thông báo đến đội ngũ TankMentor.

### 2.2. Headers

| Header           | Type     | Required | Description                       |
| ---------------- | -------- | -------- | --------------------------------- |
| `Content-Type`   | `string` | ✅ Yes   | Phải là `application/json`        |
| `Accept`         | `string` | ❌ No    | `application/json` (recommended)  |
| `X-Request-Id`   | `string` | ❌ No    | UUID để tracking request (idempotency) |

### 2.3. Request Body

```json
{
  "full_name": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "phone": "0901234567",
  "subject": "MENTORING",
  "message": "Tôi muốn tìm hiểu về chương trình mentoring 1-on-1 cho BA.",
  "preferred_contact_method": "EMAIL",
  "source": "HOMEPAGE"
}
```

| Field                      | Type     | Required | Description                                                                           |
| -------------------------- | -------- | -------- | ------------------------------------------------------------------------------------- |
| `full_name`                | `string` | ✅ Yes   | Họ và tên người liên hệ                                                              |
| `email`                    | `string` | ✅ Yes   | Địa chỉ email                                                                        |
| `phone`                    | `string` | ❌ No    | Số điện thoại liên hệ (định dạng quốc tế hoặc nội địa VN)                            |
| `subject`                  | `enum`   | ✅ Yes   | Chủ đề liên hệ. Xem bảng [Subject Enum](#subject-enum)                               |
| `message`                  | `string` | ✅ Yes   | Nội dung tin nhắn                                                                     |
| `preferred_contact_method` | `enum`   | ❌ No    | Phương thức phản hồi mong muốn. Xem bảng [Contact Method Enum](#contact-method-enum) |
| `source`                   | `enum`   | ❌ No    | Trang nguồn gửi form. Xem bảng [Source Enum](#source-enum)                           |

#### Subject Enum

| Value         | Description                            |
| ------------- | -------------------------------------- |
| `MENTORING`   | Tư vấn về chương trình mentoring       |
| `WORKSHOP`    | Hỏi về workshop / lớp học nhóm         |
| `PARTNERSHIP` | Hợp tác doanh nghiệp                  |
| `FEEDBACK`    | Góp ý / phản hồi                      |
| `OTHER`       | Chủ đề khác                            |

#### Contact Method Enum

| Value     | Description         |
| --------- | ------------------- |
| `EMAIL`   | Phản hồi qua email  |
| `PHONE`   | Phản hồi qua SĐT   |
| `ZALO`    | Phản hồi qua Zalo   |

#### Source Enum

| Value          | Description                |
| -------------- | -------------------------- |
| `HOMEPAGE`     | Trang chủ                  |
| `PROGRAMS`     | Trang chương trình đào tạo |
| `BLOG`         | Trang blog                 |
| `CONTACT_PAGE` | Trang liên hệ             |

### 2.4. Validation Rules

| Field       | Rule                                                        |
| ----------- | ----------------------------------------------------------- |
| `full_name` | Tối thiểu 2 ký tự, tối đa 100 ký tự. Không chứa số.       |
| `email`     | Phải đúng định dạng email (RFC 5322)                        |
| `phone`     | Nếu có, phải đúng định dạng: `0xxxxxxxxx` hoặc `+84xxxxxxxxx` (9–11 số) |
| `subject`   | Phải thuộc danh sách Subject Enum                           |
| `message`   | Tối thiểu 10 ký tự, tối đa 2000 ký tự                      |

### 2.5. Response — Success

**HTTP Status:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "ct_a1b2c3d4e5f6",
    "full_name": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0901234567",
    "subject": "MENTORING",
    "message": "Tôi muốn tìm hiểu về chương trình mentoring 1-on-1 cho BA.",
    "preferred_contact_method": "EMAIL",
    "source": "HOMEPAGE",
    "status": "PENDING",
    "created_at": "2026-03-05T14:55:47.000Z",
    "updated_at": "2026-03-05T14:55:47.000Z"
  },
  "meta": {
    "request_id": "req_x7y8z9",
    "response_time_ms": 120
  }
}
```

| Field             | Type       | Description                                         |
| ----------------- | ---------- | --------------------------------------------------- |
| `status`          | `string`   | Trạng thái request: `success`                       |
| `data.id`         | `string`   | ID duy nhất của contact, prefix `ct_`               |
| `data.status`     | `enum`     | Trạng thái xử lý: `PENDING`, `IN_PROGRESS`, `DONE` |
| `data.created_at` | `datetime` | Thời gian tạo (ISO 8601, UTC)                       |
| `data.updated_at` | `datetime` | Thời gian cập nhật cuối (ISO 8601, UTC)             |
| `meta.request_id` | `string`   | ID để tracing/debug                                 |
| `meta.response_time_ms` | `integer` | Thời gian xử lý request (ms)                 |

### 2.6. Response — Error

**HTTP Status:** `400 Bad Request` | `422 Unprocessable Entity` | `429 Too Many Requests` | `500 Internal Server Error`

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ.",
    "details": [
      {
        "field": "email",
        "rule": "email_format",
        "message": "Email không đúng định dạng."
      },
      {
        "field": "message",
        "rule": "min_length",
        "message": "Tin nhắn phải có ít nhất 10 ký tự.",
        "params": {
          "min": 10,
          "actual": 5
        }
      }
    ]
  },
  "meta": {
    "request_id": "req_a1b2c3",
    "response_time_ms": 45
  }
}
```

#### Error Codes

| HTTP Status | Error Code            | Description                                              |
| ----------- | --------------------- | -------------------------------------------------------- |
| `400`       | `BAD_REQUEST`         | Request body không phải JSON hợp lệ                     |
| `422`       | `VALIDATION_ERROR`    | Một hoặc nhiều field không vượt qua validation           |
| `429`       | `RATE_LIMIT_EXCEEDED` | Vượt quá giới hạn request (5 req/phút/IP)               |
| `500`       | `INTERNAL_ERROR`      | Lỗi hệ thống không xác định                             |

---

## 3. Data Dictionary

```
contacts
├── id                       : string    — Primary Key, auto-generated (ct_xxxx)
├── full_name                : string    — NOT NULL
├── email                    : string    — NOT NULL
├── phone                    : string    — NULLABLE
├── subject                  : enum      — NOT NULL
├── message                  : text      — NOT NULL
├── preferred_contact_method : enum      — DEFAULT 'EMAIL'
├── source                   : enum      — NULLABLE
├── status                   : enum      — DEFAULT 'PENDING'
├── created_at               : timestamp — auto
└── updated_at               : timestamp — auto
```

---

## 4. Rate Limiting

| Rule                    | Value                                |
| ----------------------- | ------------------------------------ |
| **Window**              | 1 phút                              |
| **Max Requests**        | 5 requests / IP                      |
| **Response khi vượt**   | `429 Too Many Requests`              |
| **Header trả về**       | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` |

Ví dụ response headers:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1709651800
```

---

## 5. Example — cURL

```bash
curl -X POST https://api.tankmentor.com/v1/contacts \
  -H "Content-Type: application/json" \
  -H "X-Request-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "full_name": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0901234567",
    "subject": "MENTORING",
    "message": "Tôi muốn tìm hiểu về chương trình mentoring 1-on-1 cho BA. Hiện tại tôi đang làm BA tại một công ty fintech.",
    "preferred_contact_method": "EMAIL",
    "source": "HOMEPAGE"
  }'
```

---

## 6. Example — JavaScript (Fetch)

```javascript
async function submitContactForm(formData) {
  const API_URL = 'https://api.tankmentor.com/v1/contacts';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': crypto.randomUUID(),
      },
      body: JSON.stringify({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        preferred_contact_method: formData.preferredContactMethod || 'EMAIL',
        source: formData.source || 'CONTACT_PAGE',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Xử lý lỗi validation
      if (result.error?.code === 'VALIDATION_ERROR') {
        const fieldErrors = {};
        result.error.details.forEach(detail => {
          fieldErrors[detail.field] = detail.message;
        });
        return { success: false, fieldErrors };
      }

      // Xử lý rate limit
      if (response.status === 429) {
        return {
          success: false,
          message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
        };
      }

      throw new Error(result.error?.message || 'Đã xảy ra lỗi.');
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[ContactForm] Submit error:', error);
    return { success: false, message: 'Không thể kết nối đến server.' };
  }
}

// Usage
const result = await submitContactForm({
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone: '0901234567',
  subject: 'MENTORING',
  message: 'Tôi muốn tìm hiểu về chương trình mentoring 1-on-1 cho BA.',
  preferredContactMethod: 'EMAIL',
  source: 'HOMEPAGE',
});

if (result.success) {
  console.log('Contact created:', result.data.id);
} else {
  console.error('Errors:', result.fieldErrors || result.message);
}
```

---

## 7. Sequence Diagram

```
User (Browser)                  API Server                 Database              Email Service
      │                              │                         │                       │
      │  POST /v1/contacts           │                         │                       │
      │  { full_name, email, ... }   │                         │                       │
      │─────────────────────────────>│                         │                       │
      │                              │                         │                       │
      │                              │── Rate Limit Check ──>  │                       │
      │                              │                         │                       │
      │                              │── Validate Input ──────>│                       │
      │                              │                         │                       │
      │                              │   (if invalid)          │                       │
      │  <── 422 VALIDATION_ERROR ───│                         │                       │
      │                              │                         │                       │
      │                              │   (if válid)            │                       │
      │                              │── INSERT contact ──────>│                       │
      │                              │<── contact record ──────│                       │
      │                              │                         │                       │
      │                              │── Send notification ───────────────────────────>│
      │                              │<── Email queued ────────────────────────────────│
      │                              │                         │                       │
      │  <── 201 Created ───────────│                         │                       │
      │  { id, status: PENDING }    │                         │                       │
      │                              │                         │                       │
```

---

## Changelog

| Version | Date       | Description                              |
| ------- | ---------- | ---------------------------------------- |
| `1.0.0` | 2026-03-05 | Initial release — Create Contact Form API |
