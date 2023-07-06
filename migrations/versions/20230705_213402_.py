"""empty message

Revision ID: fd19be00d150
Revises: 
Create Date: 2023-07-05 21:34:02.066287

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fd19be00d150'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('reaction_url', sa.String(length=2000), nullable=True),
    sa.Column('unicode', sa.String(length=70), nullable=True),
    sa.Column('emoji', sa.Boolean(), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.Column('group', sa.String(length=255), nullable=True),
    sa.Column('subgroup', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_reactions'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users'))
    )
    op.create_table('workspaces',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('icon_url', sa.String(length=2000), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('open', sa.Boolean(), nullable=False),
    sa.Column('public', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name=op.f('fk_workspaces_owner_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_workspaces'))
    )
    op.create_table('channels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('workspace_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=2000), nullable=True),
    sa.Column('protected', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name=op.f('fk_channels_owner_id_users')),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], name=op.f('fk_channels_workspace_id_workspaces')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_channels'))
    )
    op.create_table('groups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workspace_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], name=op.f('fk_groups_workspace_id_workspaces')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_groups'))
    )
    op.create_table('workspace_members',
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('workspace_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['member_id'], ['users.id'], name=op.f('fk_workspace_members_member_id_users')),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], name=op.f('fk_workspace_members_workspace_id_workspaces')),
    sa.PrimaryKeyConstraint('member_id', 'workspace_id', name=op.f('pk_workspace_members'))
    )
    op.create_table('channel_members',
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], name=op.f('fk_channel_members_channel_id_channels')),
    sa.ForeignKeyConstraint(['member_id'], ['users.id'], name=op.f('fk_channel_members_member_id_users')),
    sa.PrimaryKeyConstraint('member_id', 'channel_id', name=op.f('pk_channel_members'))
    )
    op.create_table('channel_mods',
    sa.Column('mod_id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], name=op.f('fk_channel_mods_channel_id_channels')),
    sa.ForeignKeyConstraint(['mod_id'], ['users.id'], name=op.f('fk_channel_mods_mod_id_users')),
    sa.PrimaryKeyConstraint('mod_id', 'channel_id', name=op.f('pk_channel_mods'))
    )
    op.create_table('group_members',
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], name=op.f('fk_group_members_group_id_groups')),
    sa.ForeignKeyConstraint(['member_id'], ['users.id'], name=op.f('fk_group_members_member_id_users')),
    sa.PrimaryKeyConstraint('member_id', 'group_id', name=op.f('pk_group_members'))
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=True),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('content', sa.String(length=2000), nullable=False),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], name=op.f('fk_messages_channel_id_channels')),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], name=op.f('fk_messages_group_id_groups')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_messages_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_messages'))
    )
    op.create_table('files',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('message_id', sa.Integer(), nullable=True),
    sa.Column('url', sa.String(length=2000), nullable=False),
    sa.ForeignKeyConstraint(['message_id'], ['messages.id'], name=op.f('fk_files_message_id_messages')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_files'))
    )
    op.create_table('messengers',
    sa.Column('message_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['message_id'], ['messages.id'], name=op.f('fk_messengers_message_id_messages')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_messengers_user_id_users')),
    sa.PrimaryKeyConstraint('message_id', 'user_id', name=op.f('pk_messengers'))
    )
    op.create_table('user_reactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('reaction_id', sa.String(length=255), nullable=False),
    sa.Column('message_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['message_id'], ['messages.id'], name=op.f('fk_user_reactions_message_id_messages')),
    sa.ForeignKeyConstraint(['reaction_id'], ['reactions.id'], name=op.f('fk_user_reactions_reaction_id_reactions')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_reactions_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_user_reactions'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_reactions')
    op.drop_table('messengers')
    op.drop_table('files')
    op.drop_table('messages')
    op.drop_table('group_members')
    op.drop_table('channel_mods')
    op.drop_table('channel_members')
    op.drop_table('workspace_members')
    op.drop_table('groups')
    op.drop_table('channels')
    op.drop_table('workspaces')
    op.drop_table('users')
    op.drop_table('reactions')
    # ### end Alembic commands ###