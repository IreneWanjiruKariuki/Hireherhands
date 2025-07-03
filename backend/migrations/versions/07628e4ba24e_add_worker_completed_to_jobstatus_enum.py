"""Add WORKER_COMPLETED to JobStatus enum

Revision ID: 07628e4ba24e
Revises: ddbf6c22b92e
Create Date: 2025-07-01 16:30:27.731980

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '07628e4ba24e'
down_revision: Union[str, None] = 'ddbf6c22b92e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
