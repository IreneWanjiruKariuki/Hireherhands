"""Add worker_completed to JobStatus enum

Revision ID: 3c991a85e385
Revises: 63d01b577662
Create Date: 2025-07-01 16:34:19.356059

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3c991a85e385'
down_revision: Union[str, None] = '63d01b577662'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("ALTER TYPE jobstatus ADD VALUE 'worker_completed'")

def downgrade():
    raise NotImplementedError("Downgrade not supported for enum changes")