Database Design:

1.Normalization: The product_translation table separates translatable content (e.g., name, description) from the core product details (e.g., SKU, price) to reduce data redundancy and improve efficiency.

2.Language Flexibility: Adding support for new languages is simple—just insert a new row into the product_translation table without altering the schema.

3.Scalability: This design can handle the addition of multiple languages without requiring any changes to the database schema, making it scalable for future needs.

4.Data Integrity: A foreign key relationship between the product and product_translation tables ensures that each translation is linked to an existing product, maintaining data consistency.
