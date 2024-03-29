"""empty message

Revision ID: 9d5a9f86973b
Revises: 04180b9e92ce
Create Date: 2023-12-08 22:16:37.501354

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9d5a9f86973b'
down_revision = '04180b9e92ce'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_reactions', schema=None) as batch_op:
        batch_op.drop_constraint('fk_user_reactions_message_id_messages', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_user_reactions_message_id_messages'), 'messages', ['message_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_reactions', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_user_reactions_message_id_messages'), type_='foreignkey')
        batch_op.create_foreign_key('fk_user_reactions_message_id_messages', 'messages', ['message_id'], ['id'])

    # ### end Alembic commands ###
