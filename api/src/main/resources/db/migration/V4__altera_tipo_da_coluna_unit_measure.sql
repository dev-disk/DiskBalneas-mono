UPDATE products
SET unit_measure = '0' WHERE unit_measure = 'UNIDADE';

UPDATE products
SET unit_measure = '0' WHERE unit_measure = 'UN';

UPDATE products
SET unit_measure = '0' WHERE unit_measure = 'string';

UPDATE products
SET unit_measure = '1' WHERE unit_measure = 'DOSE';

UPDATE products
SET unit_measure = '2' WHERE unit_measure = 'LITRO';

UPDATE products
SET unit_measure = '2' WHERE unit_measure = 'L';

ALTER TABLE products
	ALTER COLUMN unit_measure TYPE SMALLINT USING unit_measure::SMALLINT;