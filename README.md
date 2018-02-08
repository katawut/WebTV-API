# WebTV Service RESTful API
WebTV Service is the project which provide data of WebTV service in JSON Format.

Database ใช้เป็น MySQL

ทำ Caching ด้วย Redis

# API References

## Home Page Hightlight

#### Reading
ดึง content ที่เป็น highlight มาแสดง

##### Example:
GET /v1/home/highlight

#### Delete Cache
ลบ cache ของ highlight

##### Example:
DELETE /v1/home/highlight

## Stats
จัดการข้อมูลสถิติ เช่น ยอดวิว ยอดแชร์

#### Reading
GET stats/count/:section/:id
ดึงข้อมูล ยอดวิวและยอดแชร์ ของ section ที่เลือก

##### Example:
GET /v1/stats/count/channel/25

#### Updating
อัพเดทข้อมูลยอดวิวหรือยอดแชร์ โดยใส่รายละเอียดที่ต้องการอัพเดทด้วย JSON

##### Example:
POST /v1/stats/count/