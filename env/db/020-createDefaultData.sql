insert into public.users(email, password, role)
values 
  ('root', '$2a$12$K/35cIvudTfGJvHAtQ6opecxe6bHR16h2sQyfdxkzcdpWheBJejhm', 'admin'),
  ('admin', '$2a$12$K/35cIvudTfGJvHAtQ6opecxe6bHR16h2sQyfdxkzcdpWheBJejhm', 'admin'),
  ('test', '$2a$12$K/35cIvudTfGJvHAtQ6opecxe6bHR16h2sQyfdxkzcdpWheBJejhm', 'user');

insert into orderstates(name, title)
values
  ('Created', 'Создано'),
  ('Done', 'Выполнено');

insert into productscategory(title)
values
  ('Рубашки'),
  ('Спорт'),
  ('Верхняя одежда');