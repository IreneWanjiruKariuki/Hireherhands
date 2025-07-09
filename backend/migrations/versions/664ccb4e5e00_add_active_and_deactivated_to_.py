"""Add active and deactivated to workerstatus enum

Revision ID: 664ccb4e5e00
Revises: cf405267e5a5
Create Date: 2025-07-09 06:14:34.139277

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '664ccb4e5e00'
down_revision = 'cf405267e5a5'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE workerstatus ADD VALUE IF NOT EXISTS 'active';")
    op.execute("ALTER TYPE workerstatus ADD VALUE IF NOT EXISTS 'reactivated';")
    pass


def downgrade():
    pass
