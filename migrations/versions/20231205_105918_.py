"""empty message

Revision ID: 04180b9e92ce
Revises: b37fd4941e43
Create Date: 2023-12-05 10:59:18.337496

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '04180b9e92ce'
down_revision = 'b37fd4941e43'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_reactions', schema=None) as batch_op:
        batch_op.alter_column('reaction_id',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.Integer(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_reactions', schema=None) as batch_op:
        batch_op.alter_column('reaction_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(length=255),
               existing_nullable=False)

    # ### end Alembic commands ###
